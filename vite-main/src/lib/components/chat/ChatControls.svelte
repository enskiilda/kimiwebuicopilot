<script lang="ts">
        import { slide } from 'svelte/transition';
        import { Pane, PaneResizer } from 'paneforge';

        import { onDestroy, onMount, tick } from 'svelte';
        import {
                mobile,
                showControls,
                showArtifacts,
                showEmbeds
        } from '$lib/stores';

        import Controls from './Controls/Controls.svelte';
        import Drawer from '../common/Drawer.svelte';
        import Artifacts from './Artifacts.svelte';
        import Embeds from './ChatControls/Embeds.svelte';

        export let history;
        export let models = [];

        export let chatId = null;

        export let chatFiles = [];
        export let params = {};


        export let pane;

        let mediaQuery;
        let largeScreen = false;
        let dragged = false;

        let minSize = 0;

        export const openPane = () => {
                if (parseInt(localStorage?.chatControlsSize)) {
                        const container = document.getElementById('chat-container');
                        let size = Math.floor(
                                (parseInt(localStorage?.chatControlsSize) / container.clientWidth) * 100
                        );
                        pane.resize(size);
                } else {
                        pane.resize(minSize);
                }
        };

        const handleMediaQuery = async (e) => {
                if (e.matches) {
                        largeScreen = true;
                } else {
                        largeScreen = false;
                        pane = null;
                }
        };

        const onMouseDown = (event) => {
                dragged = true;
        };

        const onMouseUp = (event) => {
                dragged = false;
        };

        onMount(() => {
                mediaQuery = window.matchMedia('(min-width: 1024px)');

                mediaQuery.addEventListener('change', handleMediaQuery);
                handleMediaQuery(mediaQuery);

                const container = document.getElementById('chat-container');

                minSize = Math.floor((350 / container.clientWidth) * 100);

                const resizeObserver = new ResizeObserver((entries) => {
                        for (let entry of entries) {
                                const width = entry.contentRect.width;
                                const percentage = (350 / width) * 100;
                                minSize = Math.floor(percentage);

                                if ($showControls) {
                                        if (pane && pane.isExpanded() && pane.getSize() < minSize) {
                                                pane.resize(minSize);
                                        } else {
                                                let size = Math.floor(
                                                        (parseInt(localStorage?.chatControlsSize) / container.clientWidth) * 100
                                                );
                                                if (size < minSize) {
                                                        pane.resize(minSize);
                                                }
                                        }
                                }
                        }
                });

                resizeObserver.observe(container);

                document.addEventListener('mousedown', onMouseDown);
                document.addEventListener('mouseup', onMouseUp);
        });

        onDestroy(() => {
                showControls.set(false);

                mediaQuery.removeEventListener('change', handleMediaQuery);
                document.removeEventListener('mousedown', onMouseDown);
                document.removeEventListener('mouseup', onMouseUp);
        });

        const closeHandler = () => {
                showControls.set(false);
                showArtifacts.set(false);
                showEmbeds.set(false);
        };

        $: if (!chatId) {
                closeHandler();
        }
</script>

{#if !largeScreen}
        {#if $showControls}
                <Drawer
                        show={$showControls}
                        onClose={() => {
                                showControls.set(false);
                        }}
                >
                        <div
                                class=" {$showArtifacts || $showEmbeds
                                        ? ' h-screen  w-full'
                                        : 'px-4 py-3'} h-full"
                        >
                                {#if $showEmbeds}
                                        <Embeds />
                                {:else if $showArtifacts}
                                        <Artifacts {history} />
                                {:else}
                                        <Controls
                                                on:close={() => {
                                                        showControls.set(false);
                                                }}
                                                {models}
                                                bind:chatFiles
                                                bind:params
                                        />
                                {/if}
                        </div>
                </Drawer>
        {/if}
{:else}
        {#if $showControls}
                <PaneResizer
                        class="relative flex items-center justify-center group border-l border-gray-50 dark:border-gray-850 hover:border-gray-200 dark:hover:border-gray-800  transition z-20"
                        id="controls-resizer"
                >
                        <div
                                class=" absolute -left-1.5 -right-1.5 -top-0 -bottom-0 z-20 cursor-col-resize bg-transparent"
                        ></div>
                </PaneResizer>
        {/if}

        <Pane
                bind:pane
                defaultSize={0}
                onResize={(size) => {
                        if ($showControls && pane.isExpanded()) {
                                if (size < minSize) {
                                        pane.resize(minSize);
                                }

                                if (size < minSize) {
                                        localStorage.chatControlsSize = 0;
                                } else {
                                        const container = document.getElementById('chat-container');
                                        localStorage.chatControlsSize = Math.floor((size / 100) * container.clientWidth);
                                }
                        }
                }}
                onCollapse={() => {
                        showControls.set(false);
                }}
                collapsible={true}
                class=" z-10 bg-white dark:bg-gray-850"
        >
                {#if $showControls}
                        <div class="flex max-h-full min-h-full">
                                <div
                                        class="w-full {$showArtifacts || $showEmbeds
                                                ? ' '
                                                : 'px-4 py-3 bg-white dark:shadow-lg dark:bg-gray-850 '} z-40 pointer-events-auto overflow-y-auto scrollbar-hidden"
                                        id="controls-container"
                                >
                                        {#if $showEmbeds}
                                                <Embeds overlay={dragged} />
                                        {:else if $showArtifacts}
                                                <Artifacts {history} overlay={dragged} />
                                        {:else}
                                                <Controls
                                                        on:close={() => {
                                                                showControls.set(false);
                                                        }}
                                                        {models}
                                                        bind:chatFiles
                                                        bind:params
                                                />
                                        {/if}
                                </div>
                        </div>
                {/if}
        </Pane>
{/if}
