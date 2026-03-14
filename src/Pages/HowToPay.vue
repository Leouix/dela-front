<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";



const props = defineProps({
    systemWallet: String,
});

</script>

<template>
    
    <AppLayout>
        <div class="content">
            <header>
                <h1>Инструкция по переводу USDT с одного кошелька на другой</h1>
            </header>

            <section class="task-flow task-flow--1">
                <p>
                    На видео показываю как выполнить перевод USDT с Bybit на номер другого кошелька<span class="section-green fs-13">{{props.systemWallet}}</span>.
                </p>
                <p>
                    В результате перевода мы получим TxID (Hash транзакции), который нужно вставить в поле на странице
                    <a class="section-link" href="https://dela-dela.cloud/top-up-balance">пополнения баланса.</a>
                </p>
                <p>

                    У меня на Bybit было 47 USDT, поэтому я перевожу с кошелька этой биржи, но в любых других криптобиржах или криптокошельках процесс перевода аналогичный, главное правильно выбрать валюту и сеть, в нашем случае валюта - <span class="section-blue">USDT</span>, сеть - <span class="section-blue">Tron(TRX-20)</span>.
                </p>
            </section>

            <div style="width:100%; max-width:360px; margin:0 auto;">
                <div style="position:relative; padding-top:177.78%;">
                    <iframe
                        src="https://www.youtube.com/embed/gq8P_iM9_GY"
                        style="position:absolute; top:0; left:0; width:100%; height:100%;"
                        frameborder="0"
                        allowfullscreen>
                    </iframe>
                </div>
            </div>

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

h4 {

    margin-left: 15px;
    @media screen and (min-width: 769px) {
        margin-left: 25px;
    }
}

.fs-13 {
    font-size: 13px;
}

.section-blue {
    color: #7272ca;
}
</style>
