import { VERSION } from "@/VERSION";
import Image from "next/image";


export default function BuiltViaElectron() {
	return (
		<div className="pt-6">
			<h1 className="text-2xl font-bold">Version {VERSION}</h1>
			<p className="mt-4 text-gray-500">
				This is the first version of the app. It is a work in progress and will
				be updated regularly.
			</p>

			<h2 className="text-2xl font-bold mt-12">Env Variables</h2>
			<p className="mt-4 text-gray-500">
				See the .env.example file for the example structure:
			</p>

			{/* Reading Back  Variables from a local file */}
			<h2 className="text-xl font-bold mt-6">Reading Live PUBLIC Vars:</h2>
			<p className="mt-4 text-gray-200">
				<span className="font-bold text-blue-300">
					NEXT_PUBLIC_SUPABASE_PROJECT_REF
				</span>
				=
				<span className="font-mono text-orange-300">
					{process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF}
				</span>
			</p>
			<p className="mt-4 text-gray-200">
				<span className="font-bold text-blue-300">
					NEXT_PUBLIC_SUPABASE_URL
				</span>
				=
				<span className="font-mono text-orange-300">
					{process.env.NEXT_PUBLIC_SUPABASE_URL}
				</span>
			</p>
			<p className="mt-4 text-gray-200">
				<span className="font-bold text-blue-300">
					NEXT_PUBLIC_SUPABASE_PROJECT_REF
				</span>
				=
				<span className="font-mono text-orange-300">
					{process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.substring(0, 55)}...
					(Truncated)
				</span>
			</p>
			<p className="mt-4 text-gray-200">
				<span className="font-bold text-blue-300">
					NEXT_PUBLIC_SUPABASE_STORAGE_URL
				</span>
				=
				<span className="font-mono text-orange-300">
					{process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}
				</span>
			</p>

			<h2 className="text-xl font-bold mt-6">Logo Images</h2>
			<div className="flex gap-4 w-full">
				<div className="w-1/2 flex flex-col gap-3 text-xs justify-center items-center bg-zinc-900">
					<Image
						src="/main-logo-dark-lg.png"
						alt="logo"
						width={480}
						height={64}
					/>
					<p className="text-gray-200 -mt-20 mb-2">Logo for Dark Mode</p>
				</div>
				<div className="w-1/2 flex flex-col gap-3 text-xs justify-center items-center bg-white">
					<Image
						src="/main-logo-light-lg.png"
						alt="logo"
						width={480}
						height={64}
					/>
					<p className="text-gray-800 -mt-20 mb-2">Logo for Light Mode</p>
				</div>
			</div>

			<h2 className="text-2xl font-bold mt-6">How it works</h2>
			<p className="mt-4 text-gray-500">
				Simply enter credentials for your Supabase API Keys, and then deploy it
				directly to Vercel. The app is a wizard that guides you through each
				step, collection all the info in a neat UI instead of a clunk CLI
			</p>
			<p className="mt-4 text-gray-500">
				Please note - although this will work for experienced developers this is
				aimed at Vibe Coders or those who are not comfortable with the command
				line. It lets them get something up and running as quickly as possible.
			</p>
			{/* Screenshot of public/screenshots/electron-app-screenshot-1.png */}
			<div className="mt-4">
				<Image
					src="/screenshots/electron-app-screenshot-1.png"
					alt="Electron App Screenshot"
					width={1000}
					height={800}
					className="rounded-lg shadow-lg"
				/>
			</div>
			<p className="mt-4 text-gray-500">Download link coming soon...</p>
		</div>
	);
}