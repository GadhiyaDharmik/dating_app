import Sidebar from "../../component/SideBar";
import PersonalInfoForm from "../../component/PersonalInfoForm";


function PersonalInfoPage(){
return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* <Sidebar /> */}
      <div className="flex flex-col w-full gap-4">
        <PersonalInfoForm />
      </div>
    </div>
  );
}

export default PersonalInfoPage;
