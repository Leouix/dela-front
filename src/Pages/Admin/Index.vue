<script setup>

import AppLayout from "@/Layouts/AppLayout.vue";

</script>

<template>
    
    <AppLayout>
        <div class="admin-links">
            <a href="/moderation-vacancies" class="admin-link">
                <img
                    src="/images/icons/list.svg"
                    class="admin-link__icon moderation-svg"
                    alt="moderation icon"
                />
                <span class="admin-link__text">Модерация — вакансии</span>
            </a>

            <a href="/moderation-tasks" class="admin-link">
                <img
                    src="/images/icons/list.svg"
                    class="admin-link__icon moderation-svg"
                    alt="moderation icon"
                />
                <span class="admin-link__text">Модерация — задачи</span>
            </a>

            <a href="/company/new-partner-vacancy" class="admin-link">
                <img
                    src="/images/icons/document.svg"
                    class="admin-link__icon partner-vacancy-svg"
                    alt="partner vacancy icon"
                />
                <span class="admin-link__text">Создать партнёрскую вакансию</span>
            </a>
        </div>
    </AppLayout>
</template>

<style scoped>
.admin-links {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 16px;
}

.admin-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    text-decoration: none;
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    color: #111827;
    transition: all 0.2s ease;
}

.admin-link:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    transform: translateY(-2px);
}

.admin-link__icon {
    width: 28px;
    height: 28px;
    flex-shrink: 0;
}

.admin-link__text {
    font-size: 15px;
    font-weight: 500;
}

/* опционально — кастомизация иконок */
.moderation-svg {
    opacity: 0.8;
}

.partner-vacancy-svg {
    opacity: 0.9;
}

</style>
