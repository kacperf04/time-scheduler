import Link from "next/link";

type AuthType = "login" | "register";

interface AuthContainerProps {
    children: React.ReactNode; 
    type: AuthType;
};


export default function AuthContainer(
    props: AuthContainerProps
) {
    
    return (
        <>
            

            <div className="flex flex-row items-center gap-12 py-14 px-12 bg-white/70 shadow-xl rounded-xl min-h-80">

                <div className="min-w-80">
                    {props.children}
                </div>

                <div className="w-0.5 bg-on-primary-container/50 self-stretch"></div>

                <div className="flex flex-col items-center justify-between self-stretch py-2 min-w-64">
                    <div className="flex flex-col gap-4 justify-center items-center">
                        <h1 className="text-3xl font-mono">
                            {
                                props.type == "login"
                                ? "Welcome back!"
                                : "Welcome!"
                            }
                        </h1>
                        <p className="text-md font-mono">
                            {
                                props.type == "login"
                                ? "Please log into your account"
                                : "Please register"
                            }
                        </p>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-md font-mono">
                            {
                                props.type == "login"
                                ? "Don't have an account?"
                                : "Already have an account?"
                            }
                        </p>
                        <Link href={props.type == "login" ? "/register" : "/login"} className="text-sm underline font-mono">
                            {
                                props.type == "login"
                                ? "Register"
                                : "Login"
                            }
                        </Link>
                    </div>
                    <p className="text-2xl font-mono">TimeScheduler</p>
                </div>

             </div>
        </>
    )
}