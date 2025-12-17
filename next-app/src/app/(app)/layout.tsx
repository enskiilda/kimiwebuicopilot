import type { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
	return (
		<div className="app relative">
			<div className="text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-900 h-screen max-h-[100dvh] flex flex-row transition-all duration-300 overflow-x-auto">
				<style
					// Zachowujemy wymuszenie szerokości jak w Svelte +layout.svelte
					dangerouslySetInnerHTML={{
						__html: `:global(.app-content-wrapper){display:flex;flex:0 0 100vw;min-width:100vw;overflow:visible;}`
					}}
				/>
				<div className="app-content-wrapper">{children}</div>
			</div>
		</div>
	);
}
