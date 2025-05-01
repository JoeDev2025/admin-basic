"use client";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export default function SecurityChangePassword() {
	const [toggleShowPassword, setToggleShowPassword] = useState(false);

	return (
		<div>
			<label className="mb-3 block text-sm font-medium ">
				Change Password{" "}
			</label>
			<div className="relative">
				{/* Input Password */}
				<input
					type={toggleShowPassword ? "text" : "password"}
					placeholder={
						toggleShowPassword ? "enter new password..." : "••••••••••••"
					}
					className="w-full rounded-lg border bg-black px-5 py-3 text-white outline-none transition focus:border-sky-800 active:border-primary disabled:cursor-default disabled:bg-white/10"
				/>

				{/* Show or MAsk password */}

				<button
					onClick={() => setToggleShowPassword(!toggleShowPassword)}
					className="absolute top-1/2 -translate-y-1/2 right-0 w-10 h-10 flex justify-center items-center text-zinc-500 hover:text-white cursor-pointer">
					{toggleShowPassword ? <FaRegEye /> : <FaRegEyeSlash />}
				</button>
			</div>
		</div>
	);
}
