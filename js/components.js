/**
 * components.js
 * Komponen custom A-Frame untuk interaksi pada detail viewer.
 * Harus dimuat SETELAH aframe.min.js
 */

// Komponen drag-rotate: memungkinkan pengguna memutar objek 3D
// dengan drag mouse atau sentuhan jari pada detail viewer.
AFRAME.registerComponent('drag-rotate', {
    schema: { speed: { default: 1 } },
    init: function () {
        this.ifMouseDown = false;
        this.x_prev = 0;
        this.y_prev = 0;

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);

        window.addEventListener('mousedown', this.onMouseDown);
        window.addEventListener('mouseup', this.onMouseUp);
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('touchstart', this.onTouchStart);
        window.addEventListener('touchend', this.onTouchEnd);
        window.addEventListener('touchmove', this.onTouchMove);
    },
    remove: function () {
        window.removeEventListener('mousedown', this.onMouseDown);
        window.removeEventListener('mouseup', this.onMouseUp);
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('touchstart', this.onTouchStart);
        window.removeEventListener('touchend', this.onTouchEnd);
        window.removeEventListener('touchmove', this.onTouchMove);
    },
    onMouseDown: function (event) {
        if (!document.getElementById('detail-view-screen').classList.contains('active')) return;
        const viewer = document.querySelector('.detail-viewer-container');
        if (!viewer || !viewer.contains(event.target)) return;
        this.ifMouseDown = true;
        this.x_prev = event.clientX;
        this.y_prev = event.clientY;
    },
    onMouseUp: function () {
        this.ifMouseDown = false;
    },
    onMouseMove: function (event) {
        if (this.ifMouseDown) {
            var dX = event.clientX - this.x_prev;
            var dY = event.clientY - this.y_prev;

            this.el.object3D.rotation.y += dX * 0.007 * this.data.speed;
            this.el.object3D.rotation.x += dY * 0.007 * this.data.speed;

            const maxRotX = Math.PI / 3;
            this.el.object3D.rotation.x = Math.max(-maxRotX, Math.min(maxRotX, this.el.object3D.rotation.x));

            this.x_prev = event.clientX;
            this.y_prev = event.clientY;
        }
    },
    onTouchStart: function (event) {
        if (!document.getElementById('detail-view-screen').classList.contains('active')) return;
        const viewer = document.querySelector('.detail-viewer-container');
        if (!viewer || !viewer.contains(event.target)) return;
        if (event.touches.length === 1) {
            this.ifMouseDown = true;
            this.x_prev = event.touches[0].clientX;
            this.y_prev = event.touches[0].clientY;
        }
    },
    onTouchEnd: function () {
        this.ifMouseDown = false;
    },
    onTouchMove: function (event) {
        if (this.ifMouseDown && event.touches.length === 1) {
            var dX = event.touches[0].clientX - this.x_prev;
            var dY = event.touches[0].clientY - this.y_prev;

            this.el.object3D.rotation.y += dX * 0.01 * this.data.speed;
            this.el.object3D.rotation.x += dY * 0.01 * this.data.speed;

            const maxRotX = Math.PI / 3;
            this.el.object3D.rotation.x = Math.max(-maxRotX, Math.min(maxRotX, this.el.object3D.rotation.x));

            this.x_prev = event.touches[0].clientX;
            this.y_prev = event.touches[0].clientY;
        }
    }
});

// Komponen zoom-controls: memungkinkan pengguna zoom in/out
// dengan scroll mouse atau cubit (pinch) dua jari pada detail viewer.
AFRAME.registerComponent('zoom-controls', {
    schema: { min: { default: 2.5 }, max: { default: 12 }, speed: { default: 0.005 } },
    init: function () {
        this.initialDistance = 0;

        this.onWheel = this.onWheel.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);

        window.addEventListener('wheel', this.onWheel, { passive: false });
        window.addEventListener('touchstart', this.onTouchStart);
        window.addEventListener('touchmove', this.onTouchMove);
    },
    remove: function () {
        window.removeEventListener('wheel', this.onWheel);
        window.removeEventListener('touchstart', this.onTouchStart);
        window.removeEventListener('touchmove', this.onTouchMove);
    },
    onWheel: function (event) {
        if (!document.getElementById('detail-view-screen').classList.contains('active')) return;
        const viewer = document.querySelector('.detail-viewer-container');
        if (!viewer || !viewer.contains(event.target)) return;

        event.preventDefault();

        const cam = this.el.object3D;
        cam.position.z += event.deltaY * this.data.speed;
        cam.position.z = Math.max(this.data.min, Math.min(this.data.max, cam.position.z));
    },
    onTouchStart: function (event) {
        if (!document.getElementById('detail-view-screen').classList.contains('active')) return;
        const viewer = document.querySelector('.detail-viewer-container');
        if (!viewer || !viewer.contains(event.target)) return;

        if (event.touches.length === 2) {
            this.initialDistance = this.getDistance(event.touches[0], event.touches[1]);
        }
    },
    onTouchMove: function (event) {
        if (!document.getElementById('detail-view-screen').classList.contains('active')) return;
        const viewer = document.querySelector('.detail-viewer-container');
        if (!viewer || !viewer.contains(event.target)) return;

        if (event.touches.length === 2) {
            const currentDistance = this.getDistance(event.touches[0], event.touches[1]);
            const diff = currentDistance - this.initialDistance;

            const cam = this.el.object3D;
            cam.position.z -= diff * 0.015;
            cam.position.z = Math.max(this.data.min, Math.min(this.data.max, cam.position.z));

            this.initialDistance = currentDistance;
        }
    },
    getDistance: function (t1, t2) {
        const dx = t1.clientX - t2.clientX;
        const dy = t1.clientY - t2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
});
