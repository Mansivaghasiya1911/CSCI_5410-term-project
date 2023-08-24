import "./header.css";

const Header = () => {
  return (
    <>
      <div className="container p-1 header">
        <div className="row">
          <div className="col-md-12 logo-center">
            <img
              className="logo"
              src={process.env.PUBLIC_URL + "/logo.png"}
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
