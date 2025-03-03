export default async function ClassId({params}:any){
    const {classid} = await params;
    return <div>
        class of ID {classid}
    </div>
}