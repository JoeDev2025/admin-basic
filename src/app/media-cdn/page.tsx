"use client";

import MediaGallery from "@/components/MediaUploader/MediaGallery";
import MediaUploader from "@/components/MediaUploader/MediaUploader";
import { PageProtected } from "@/components/UI/Auth/PageProtected";
import DefaultLayout from "@/components/UI/DefaultLayout";
import PageHeader from "@/components/UI/PageHeader";
import { useState } from "react";
import { FaKeycdn } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";

// Doesn't with "use client";
// export const metadata: Metadata = {
// 	title: "Media CDN",
// 	description:
// 		"Manage your media files here - The Blog tool, and other areas such as uploading a profile image all use this same tool and will be marked as such",
// };

export default function Home() {
	const [newRefresh, setNewRefresh] = useState(1);
	const [showMore, setShowMore] = useState(false);
	return (
		<DefaultLayout>
			<PageProtected>
				<PageHeader title="Media CDN" icon={FaKeycdn}>
					<p>
						Manage your media files here - The Blog tool, and other areas such
						as uploading a profile image all use this same tool and will be
						marked as such{" "}
						<button
							className="text-sky-500 ml-2 text-xs"
							onClick={() => setShowMore(!showMore)}>
							{showMore ? "show less" : "show more"}
						</button>
					</p>
				</PageHeader>
				{showMore && (
					<div className="my-4 p-4 bg-gray-900 rounded flex flex-col gap-2 text-gray-500 text-sm">
						<h3 className="text-lg font-semibold text-white">
							Standard Direct Uploads
						</h3>
						<p>
							You can upload image (JPEG, PNG, GIF, WEBP, HEIC) & video (MP4,
							MOV) files here and they will be saved into the Supabase Storage
							bucket:{" "}
							<span className="text-gray-300 text-xs font-mono">
								{process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}
								/public/media_uploads_bucket/{`{type}`}/{`{id}`}.{`{ext}`}
							</span>
						</p>
						<p>
							To optimize delivery the default image settings are to convert
							images to WebP, resize to 2048px max width/height, and convert
							QuickTime videos to MP4. All images/videos uploaded will have a
							thumbnail/poster generated and stored in the same location. Image
							thumbnail default max (w or h) size is 256 pixels, Video posters
							are 1024
						</p>
						<h3 className="text-lg font-semibold text-white">
							Blog Uploads{" "}
							<span
								className="font-mono text-sm text-sky-700 ml-3"
								title="Search the codebase to see this function">
								<FaMagnifyingGlass className="inline" /> uploadBlogImageFile()
							</span>
						</h3>
						<p>
							When adding images into the blog tool, they are set to be 1024px
							maximum width or height
						</p>
						<h3 className="text-lg font-semibold text-white">
							Profile Image Uploads{" "}
							<span
								className="font-mono text-sm text-sky-700 ml-3"
								title="Search the codebase to see this function">
								<FaMagnifyingGlass className="inline" />{" "}
								uploadProfileImageFile()
							</span>
						</h3>
						<p>
							Profile images are set to be 512px maximum width or height and
							128px for the thumbnails
						</p>
					</div>
				)}
				<MediaUploader setNewRefresh={setNewRefresh} />
				<MediaGallery newRefresh={newRefresh} />
			</PageProtected>
		</DefaultLayout>
	);
}
