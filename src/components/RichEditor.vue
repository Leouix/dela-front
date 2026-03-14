<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import Quill from 'quill'
import BlotFormatter from '@enzedonline/quill-blot-formatter2';

const editor = ref(null)
const emit = defineEmits(['update:modelValue'])

const icons = Quill.import('ui/icons')

icons.clean = `
  <img src="/images/icons/icons8-clean-100.png"
       style="width:18px;height:18px;object-fit:contain;" />
`

icons['undo'] = '<svg viewbox="0 0 18 18"><polygon class="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10"></polygon><path class="ql-stroke" d="M12.8,5.4a5,5,0,0,0-7.3,1.3l-1.5,3.3"></path></svg>';
icons['redo'] = '<svg viewbox="0 0 18 18"><polygon class="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10"></polygon><path class="ql-stroke" d="M5.2,5.4a5,5,0,0,1,7.3,1.3l1.5,3.3"></path></svg>';


const props = defineProps({
    modelValue: String,
    typeEditor: String|null,
})

let quillInstance = null;

let editorPlaceholder = 'Добавьте описание задачи, а также какой вы ожидаете получить результат выполненной работы';

if (props.typeEditor === 'add_catalog') {
    editorPlaceholder = 'Несколько слов о себе';
}

onMounted(() => {

    Quill.register('modules/blotFormatter', BlotFormatter);

    quillInstance = new Quill(editor.value, {
        modules: {
            blotFormatter: {
                align: {
                    allowAligning: false,
                },
                resize: {
                    allowResizing: true,
                },
                delete: {
                    allowKeyboardDelete: true,
                },
                image: {
                    allowAltTitleEdit: false,
                    allowCompressor: true, // default false, enable with true
                    linkOptions: {
                        allowLinkEdit: false //default true
                    }
                }
            }, // Твой рабочий ресайзер
            toolbar: {
                // Переносим твой массив кнопок в свойство container
                container: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    ['link', 'image'],
                    [{ header: 1 }, { header: 2 }],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ size: ['small', false, 'large', 'huge'] }],
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    [{ color: [] }, { background: [] }],
                    [{ font: [] }],
                    [{ 'align': '' }],        // left (по умолчанию)
                    [{ 'align': 'center' }],  // 👈 отдельная кнопка
                    [{ 'align': 'right' }],
                    [{ 'align': 'justify' }],
                    ['undo', 'redo'],
                    ['clean'],
                ],
                // Добавляем обработчики здесь
                handlers: {
                    image: imageHandler, // Та самая функция загрузки на Laravel
                    undo: () => quillInstance.history.undo(),
                    redo: () => quillInstance.history.redo(),
                }
            },
        },
        placeholder: editorPlaceholder,
        theme: 'snow',
    })

    // установить начальное значение
    quillInstance.root.innerHTML = props.modelValue || ''

    // слушать изменения
    quillInstance.on('text-change', () => {
        emit('update:modelValue', quillInstance.root.innerHTML)
    });

    const toolbar = editor.value.previousSibling

    toolbar.querySelector('.ql-clean')?.setAttribute('title', 'Очистить форматирование')
    toolbar.querySelector('.ql-undo')?.setAttribute('title', 'Отменить')
    toolbar.querySelector('.ql-redo')?.setAttribute('title', 'Повторить')

})

const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    const maxSize = 4096 * 1024;

    input.onchange = async () => {
        const file = input.files[0];

        // Валидация размера на клиенте (4MB)
        if (file.size > maxSize) {
            alert('Файл слишком большой! Максимум 4 Мб.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        // Отправляем на твой Laravel API
        try {
            const response = await axios.post('/api/upload-image', formData);
            const url = response.data.url;

            const range = quillInstance.getSelection();
            quillInstance.insertEmbed(range.index, 'image', url);
        } catch (error) {
            console.error('Ошибка загрузки', error);
        }
    };
};
</script>

<template>
    <div ref="editor" class="quill-editor" />
</template>

<style>
@import 'quill/dist/quill.snow.css';

.quill-editor {
    min-height: 250px;
    background: rgb(90, 90, 90);
    color: #dbdbdbd1;
    border-radius: 0 0 5px 5px;
    margin-bottom: 25px;

    .ql-editor img {
        display: inline-block;
        max-width: 100%;
    }

    .ql-editor.ql-blank::before {
        color: #dbdbdbd1;
    }


}

.ql-toolbar {
    background: #a4a4a4;
    border-radius: 5px 5px 0 0;
    margin-top: 25px;
}



</style>
