import FireReact from "./firereact";

function App() {
  return (
    <div>
      <div className="title">
        <h1>Embergency</h1>
      </div>

      <FireReact></FireReact>
      <div>
        <h2>text</h2>
      </div>
      <div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3120.8063354840315!2d-121.7617125!3d38.538232199999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80ead37f7489fa3f%3A0xecbfbb24087e8334!2sUniversity%20of%20California%2C%20Davis!5e0!3m2!1sen!2sus!4v1745097635450!5m2!1sen!2sus"
          width="600"
          height="450"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}

export default App;
