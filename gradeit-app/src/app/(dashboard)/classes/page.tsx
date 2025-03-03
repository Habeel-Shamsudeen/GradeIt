import { auth } from "@/lib/auth";

export default async function Classes(){
    const sessionData = await auth();
    console.log(sessionData)
    return <>
    <div className="">
    {JSON.stringify(sessionData) + ""}
    Classes
    </div>
    
    </>
}