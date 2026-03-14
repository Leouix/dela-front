<script setup>
import AppLayout from "../Layouts/AppLayout.vue";

</script>

<template>

    <AppLayout>
        <div class="content">
            <header>
                <h1>О сервисе</h1>
                <h4>Сервис постановки и&nbsp;выполнения задач DelaDela:</h4>
            </header>

            <section class="task-flow task-flow--1">
                <ol>
                    <li>
                        Вы <a class="section-link" href="/my/company/new-task">публикуете</a> свою задачу, прикладываете документы, описываете требования и&nbsp;<a class="section-link" href="/top-up-balance">оплачиваете</a> её&nbsp;обеспечение;
                    </li>
                    <li>
                        На вашу задачу откликаются мастера. Вы выбираете одного из&nbsp;них или&nbsp;несколько, и&nbsp;контролируете выполнение задачи на&nbsp;странице -&nbsp;<a class="section-link" href="/task-orders">Задачи на выполнение</a>;
                    </li>
                    <li>
                        При <span class="section-green">успешном</span> выполнении задачи, Мастер, который ее&nbsp;выполнял, <span class="section-green">получает назначенную сумму оплаты</span>, в&nbsp;случае <i>невыполнения</i> задачи -&nbsp;сумма оплаты <span class="underline-text">возвращается</span> Заказчику.
                    </li>
                </ol>
            </section>

            <section class="modes-and-info">
                <ul class="mode-description">
                    <li>В режиме <strong>Заказчик</strong> Вы можете публиковать задачи;</li>
                    <li>В режиме <strong>Мастер</strong> -&nbsp;Вы можете откликаться на&nbsp;задачи и&nbsp;общаться с&nbsp;Заказчиком;</li>
                    <li>Перед публикацией все задачи проходят <strong>обязательную модерацию</strong>;</li>
                    <li> Переключайтесь между режимами Мастер\Заказчик, чтобы <a class="section-green-link" href="/my/company/new-task">Создать</a> или
                        <a class="section-green-link" href="/">Откликнуться</a> на&nbsp;задачу;</li>
                    <li><a class="section-link" href="/login">Зарегистрируйтесь</a>, чтобы воспользоваться всеми возможностями сервиса;</li>
                </ul>

            </section>

            <p class="legal-info">
                Стоимость задачи рассчитываются в&nbsp;USDT. Пополнение баланса производится в&nbsp;сети&nbsp;TRC-20.
            </p>

            <p class="legal-info">
                <u>Вывод средств осуществляется в&nbsp;USDT.</u>
            </p>

            <p class="support-info">
                Отправить обратную связь или&nbsp;связаться можно по&nbsp;кнопке <strong>SUPPORT</strong> вверху экрана.
            </p>
        </div>
    </AppLayout>

</template>

<style scoped>

.content {
    max-width: 1190px;
    padding: 0 15px;
    line-height: 1.3;
}
.task-flow {
    margin-bottom: 1.5rem;
    margin-left: 10px;

    @media screen and (min-width: 769px) {
        margin-left: 45px;
    }

}

.task-flow h3 {
    margin-top: 0;
    margin-bottom: 1rem;
}

.task-flow ol {
    padding-left: 1.5rem;
    margin: 0;
    list-style-position: outside;
}

.task-flow li {
    font-weight: 400;
    font-size: 18px;
    line-height: 1.3;
    margin-bottom: 1rem;
    padding-left: 0.5rem;

    @media screen and (min-width: 769px) {
        line-height: 1.5;
    }
}

.task-flow li:last-child {
    margin-bottom: 0;
}

a.section-link {
    color: #7272ca;
    text-decoration: underline;
}

.section-green {
    color: #4AC63C;
}

.underline-text {
    text-decoration: underline;
}

.section-green-link {
    color: #4AC63C;
    text-decoration: underline;
}

.mode-description {
    li {
        font-size: 18px;
        line-height: 1.3;
    }
}

.legal-info {
    font-size: 13px;
    margin-left: 0;

    @media screen and (min-width: 769px) {
        font-size: 16px;
        margin-left: 25px;
    }

}

h4 {

    margin-left: 15px;
    @media screen and (min-width: 769px) {
        margin-left: 25px;
    }
}

.modes-and-info {

    margin-left: 0;
    @media screen and (min-width: 769px) {
        margin-left: 55px;
    }
}

.support-info {
    margin-left: 0;
    font-size: 16px;
    font-weight: 600;

    @media screen and (min-width: 769px) {
        margin-left: 25px;
    }
}

.legal-info-orange {
    color: orange;
}
</style>
