import { SetFormTypeProps } from "./AuthModal";
import { HeadingAuth } from "./Shared/HeadingAuth";

export const CheckEmailForLink = ({ setFormType }: SetFormTypeProps) => {
  return (
    <>
      <HeadingAuth type="checkemail" setFormType={setFormType} />
      <CheckEmail />
    </>
  );
};

const CheckEmail = () => {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="mb-3 flex flex-col justify-center items-center gap-3">
        {/* <Image
					src="/email.gif"
					alt="Email"
					width={200}
					height={200}
					className="rounded-3xl"
				/> */}
        {/* Video using /new-message.mp4 */}
        <video
          src="/new-message.mp4"
          autoPlay
          loop
          muted
          className="rounded-3xl"
          width={200}
          height={200}
        />

        <label className="mb-1 block text-zinc-600 dark:text-zinc-400">
          Check your email for the magic link!
        </label>
      </div>
    </form>
  );
};
