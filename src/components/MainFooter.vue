<script setup>
import DragChat from "@/components/Chat/DragChat.vue";
import NoticeError from "@/components/NoticeError.vue";
import NoticeSuccess from "@/components/NoticeSuccess.vue";

const year = new Date().getFullYear()
</script>

<template>

    <footer>
        <div class="logo-block">
            <div id="logo-text"><a href="/">DelaDela</a></div>
            <div class="sub-title">Удаленная работа, задачи</div>
            <div class="footer-contact">Email: <a href="mailto:dela.dela.cloud@gmail.com">dela.dela.cloud@gmail.com</a></div>
        </div>

        <div class="copyright-area">
            <div class="copyright-text"><a href="/oferta">Пользовательское соглашение</a></div>
            <div class="copyright-text">© {{year}} DelaDela</div>
        </div>
    </footer>

    <drag-chat/>
    <NoticeError/>
    <NoticeSuccess/>
</template>

<style scoped>
footer {
    min-height: 130px;
    border-top: 1px solid #616161;
    padding: 5px 10px;
    position: relative;
    display: flex;
    justify-content: start;
    align-items: start;

    .logo-block {

        #logo-text {
            display: block;
            font-size: 36px;
            color: #549154;
            font-family: "Akaya Telivigala", system-ui;

            a:hover {
                text-decoration: none;
            }
        }

        .sub-title {
            font-size: 10px;
        }
        .footer-contact {
            font-size: 12px;
            margin-top: 10px;
        }

    }

    .copyright-area {
        position: absolute;
        right: 0;
        left: 0;
        bottom: 10px;
        text-align: center;
        font-size: 12px;

        .created-by a {
            text-decoration: underline;
        }
    }

}
</style>
