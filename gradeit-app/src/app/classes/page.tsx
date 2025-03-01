import { auth } from "@/lib/auth";
import AuthPopup from "../_components/auth/auth-popup";

export default async function Classes(){
    const sessionData = await auth();
    console.log(sessionData)
    return <>
    {!sessionData && <AuthPopup />}
    <div className="">
    {sessionData?.user?.email}
    </div>
    
    </>
}