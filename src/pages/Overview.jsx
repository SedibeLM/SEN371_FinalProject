export default function Overview(){
  return (
    <div>
      <h1>Overview</h1>
      <p style={note}>Welcome to CampusLearn. Use the left menu to navigate:
        <br/>• Students: subscribe to topics and view materials
        <br/>• Tutors: create topics and upload materials
      </p>
    </div>
  );
}
const note = { background:"#fff", border:"1px solid #e5e7eb", padding:14, borderRadius:10, maxWidth:720 };
