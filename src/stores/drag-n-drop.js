import { defineStore } from 'pinia';

export const useDragNDropStore = defineStore('dragNDropStore', {
    state: () => ({
        items: [],
        isDragging: false,
    }),
    actions: {
        // Обновление порядка задач после перетаскивания
        updateItems(newItems) {
            this.items = newItems;
        },
        // Начало перетаскивания
        startDragging() {
            this.isDragging = true;
        },
        // Завершение перетаскивания
        stopDragging() {
            this.isDragging = false;

            const formData = new FormData;

            const items = this.items.map((item, index) => {
                return {
                    id: item.id,
                    sort_order: index
                }
            })

            formData.append('taskApplications', JSON.stringify(items))

            axios.post('/api/task-apps-save-sort-order', formData)
                .then((response) => {
                    if (response.status === 201) {

                    }
                })
                .catch((error)=>  {
                    console.log(error)
                });
        },
        // Добавление новой задачи (опционально)
        addTask(task) {
            this.items.push({ id: Date.now(), name: task });
        },
        // Удаление задачи (опционально)
        removeTask(id) {
            this.items = this.items.filter(item => item.id !== id);
        },
        moveElements(e) {
            if (e.moved) {
                const { oldIndex, newIndex } = e.moved;

                const updatedItems = [...this.items];
                // Меняем местами элементы
                [updatedItems[oldIndex], updatedItems[newIndex]] = [updatedItems[newIndex], updatedItems[oldIndex]];
                this.updateItems(updatedItems);
            }
        },
    },
});
