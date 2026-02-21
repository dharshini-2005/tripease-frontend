import { useNavigate } from "react-router-dom";

const Options = () => {
  const navigate = useNavigate(); 
  const backgroundImageStyle = {
    backgroundImage: 'url("https://www.baltana.com/files/wallpapers-2/Dark-Background-04536.jpg")', // Make sure the path starts with '/'
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    width: "100vw",
  };
  
  return (
    <div className="options" style={backgroundImageStyle}>
      <h1 className="what">What do you want to do?</h1>
      <div className="buttons">
        <div className="first-two">
        
          <button className="btncheck" onClick={() => navigate("/checklists")}>
            Checklist
          </button>

       
          <button className="btnbudget" onClick={() => navigate("/budget")}>
            Budget
          </button>
        </div>
        <div className="second-two">
   
          <button className="btnfeedback" onClick={() => navigate("/feedbacks")}>
            Feedback
          </button>

          
          <button className="btnplan" onClick={() => navigate("/plan")}>
            Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default Options;
