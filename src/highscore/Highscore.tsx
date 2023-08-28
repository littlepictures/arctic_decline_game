import "./Highscore.css";

function Highscore() {
  const data = [
    {
      name: "China",
      score: 11680.42,
    },
    {
      name: "USA",
      score: 4535.3,
    },
    {
      name: "India",
      score: 2411.73,
    },
    {
      name: "Russia",
      score: 1674.23,
    },
    {
      name: "Japan",
      score: 1061.77,
    },
    {
      name: "Iran",
      score: 690.24,
    },
  ];
  return (
    <div className="highscore">
      <h1>Arctic</h1>
      <div className="subtitle">High-scores</div>

      <div className="table">
        <div className="row header">
          <div className="rank">Rank</div>
          <div className="name">name</div>
          <div className="score">score</div>
        </div>

        {data.map((entry, index) => {
          return (
            <div key={entry.name} className="row">
              <div className="rank">{String(index + 1).padStart(2, "0")}</div>
              <div className="name">{entry.name}</div>
              <div className="score">{Math.round(entry.score)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Highscore;
