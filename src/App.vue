<script setup>
import { ref, watch } from "vue";
import { useWizard } from "@/composables/useWizard";

const {
    environments,
    projects,
    languages,
    dcpToken,
    logout,
    reset,
    selectedEnvId,
    selectedProjectId,
    selectedRoutePath,
    selectedLang,
    customParams,
    selectedProject,
    allRoutes,
    finalUrl,
    addParam,
    removeParam,
    jump,
    copyUrl,
} = useWizard();

const newParamKey = ref("");
const newParamValue = ref("");

const copied = ref(false);
function handleCopy() {
    copyUrl(editedUrl.value);
    copied.value = true;
    setTimeout(() => {
        copied.value = false;
    }, 1500);
}

function handleAddParam() {
    addParam(newParamKey.value, newParamValue.value);
    newParamKey.value = "";
    newParamValue.value = "";
}

const editedUrl = ref("");
watch(
    finalUrl,
    (val) => {
        editedUrl.value = val;
    },
    { immediate: true },
);
</script>

<template>
    <div class="min-h-screen bg-gray-50 flex flex-col text-[15px]">
        <!-- header: 标题 + 登录 + 重置 -->
        <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
            <div class="max-w-3xl mx-auto px-6 py-3 flex items-center gap-4">
                <h1 class="text-lg font-bold text-gray-800 shrink-0">测试入口</h1>

                <!-- 未登录：输入 token -->
                <template v-if="!dcpToken">
                    <input
                        v-model="dcpToken"
                        type="text"
                        placeholder="粘贴 dcpToken"
                        class="flex-1 px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                </template>

                <!-- 已登录：显示 token 摘要 + 退出 -->
                <template v-else>
                    <span class="flex-1 text-xs text-gray-400 truncate font-mono" :title="dcpToken"> ✓ {{ dcpToken.slice(0, 16) }}... </span>
                    <button @click="logout" class="text-xs text-gray-400 hover:text-red-500 transition-colors shrink-0">退出</button>
                    <button @click="reset" class="text-xs text-gray-400 hover:text-gray-600 transition-colors shrink-0">重置</button>
                </template>
            </div>
        </header>

        <main class="max-w-3xl w-full mx-auto px-6 py-5">
            <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
                <!-- 环境 -->
                <div class="flex gap-1.5">
                    <button
                        v-for="env in environments"
                        :key="env.id"
                        @click="selectedEnvId = env.id"
                        class="px-3 py-1 rounded-md text-sm font-medium transition-all"
                        :class="selectedEnvId === env.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
                    >
                        {{ env.name }}
                    </button>
                </div>

                <!-- 项目 -->
                <div class="flex gap-2">
                    <button
                        v-for="project in projects"
                        :key="project.id"
                        @click="selectedProjectId = project.id"
                        class="flex-1 px-3 py-2 rounded-lg border-2 text-left transition-all hover:shadow-sm"
                        :class="selectedProjectId === project.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200'"
                    >
                        <p class="text-sm font-medium text-gray-800">{{ project.name }}</p>
                        <p class="text-xs text-gray-400">{{ project.desc }}</p>
                    </button>
                </div>

                <!-- 路由 -->
                <div v-if="selectedProject" class="flex flex-wrap gap-1.5">
                    <button
                        v-for="route in allRoutes"
                        :key="route.path"
                        @click="selectedRoutePath = route.path"
                        class="px-2.5 py-1.5 rounded text-sm transition-all hover:bg-blue-50"
                        :class="selectedRoutePath === route.path ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-600 hover:text-gray-800'"
                        :title="route.path"
                    >
                        {{ route.label }}
                        <span v-if="route.tip" class="ml-0.5 opacity-60">({{ route.tip }})</span>
                    </button>
                </div>

                <!-- 跳转 -->
                <template v-if="finalUrl">
                    <!-- 语言 + 参数输入 -->
                    <div class="flex items-center gap-3">
                        <div class="flex gap-1">
                            <button
                                v-for="lang in languages"
                                :key="lang.id"
                                @click="selectedLang = lang.id"
                                class="px-2 py-0.5 rounded text-xs font-medium transition-all"
                                :class="selectedLang === lang.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
                            >
                                {{ lang.name }}
                            </button>
                        </div>
                        <span class="text-gray-200">|</span>
                        <input
                            v-model="newParamKey"
                            @keyup.enter="handleAddParam"
                            type="text"
                            placeholder="key"
                            class="w-20 px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <span class="text-gray-300">=</span>
                        <input
                            v-model="newParamValue"
                            @keyup.enter="handleAddParam"
                            type="text"
                            placeholder="value"
                            class="w-24 px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                            @click="handleAddParam"
                            :disabled="!newParamKey.trim()"
                            class="px-2 py-1 rounded text-xs font-medium transition-all"
                            :class="newParamKey.trim() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-100 text-gray-300 cursor-not-allowed'"
                        >
                            +
                        </button>
                    </div>

                    <!-- 参数标签 -->
                    <div class="flex flex-wrap gap-1.5">
                        <span v-if="dcpToken" class="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 rounded text-xs font-mono" :title="dcpToken">
                            <span class="text-green-600">dcpToken</span>
                            <span class="text-gray-400">=</span>
                            <span class="text-gray-700">{{ dcpToken.slice(0, 12) }}...</span>
                        </span>
                        <span v-for="p in customParams" :key="p.key" class="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-50 rounded text-xs font-mono">
                            <span class="text-blue-600">{{ p.key }}</span>
                            <span class="text-gray-400">=</span>
                            <span class="text-gray-700">{{ p.value }}</span>
                            <button @click="removeParam(p.key)" class="text-gray-400 hover:text-red-500 ml-0.5">&times;</button>
                        </span>
                    </div>

                    <!-- 地址 -->
                    <textarea
                        v-model="editedUrl"
                        rows="3"
                        class="w-full px-3 py-2 text-sm text-gray-800 font-mono bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <!-- 按钮 -->
                    <div class="flex gap-2">
                        <button
                            @click="handleCopy"
                            class="flex-1 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
                        >
                            {{ copied ? "已复制" : "复制链接" }}
                        </button>
                        <button
                            @click="jump(editedUrl)"
                            class="flex-1 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all"
                        >
                            打开链接
                        </button>
                    </div>
                </template>
            </section>
        </main>
    </div>
</template>
