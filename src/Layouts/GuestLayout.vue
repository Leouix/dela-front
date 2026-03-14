<script setup>
</script>

<template>
    <div
        class="flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0 login-form"
    >


        <div
            class="mt-6 w-full overflow-hidden  px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg login-form-inner-text"
        >
            <slot />
        </div>
    </div>
</template>

<style scoped>
.login-form {
    background: #afafaf;
    border-radius: 9px;
    color: #242424;
    justify-content: center;

}

.login-form-inner-text {
    max-width: 750px;
}
</style>
