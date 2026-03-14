export default {
    mounted(el, binding) {
        let startX = 0;
        let startY = 0;
        let isDragging = false;

        const threshold = 5; // сколько пикселей считать тасканием

        function onMouseDown(e) {
            startX = e.clientX;
            startY = e.clientY;
            isDragging = false;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }

        function onMouseMove(e) {
            const dx = Math.abs(e.clientX - startX);
            const dy = Math.abs(e.clientY - startY);
            if (dx > threshold || dy > threshold) {
                isDragging = true;
            }
        }

        function onMouseUp(e) {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            if (!isDragging) {
                // Только если не таскали — вызываем обработчик
                binding.value(e);
            }
        }

        el.addEventListener('mousedown', onMouseDown);
        el._dragClickCleanup = () => {
            el.removeEventListener('mousedown', onMouseDown);
        };
    },

    unmounted(el) {
        el._dragClickCleanup?.();
    }
};
