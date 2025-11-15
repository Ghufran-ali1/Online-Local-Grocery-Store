import React, { useState } from "react";
import { Link } from "react-router";

const jokes = [
  {
    question: "Why do programmers hate going outside to touch grass?",
    answer: "Too many bugs.",
  },
  {
    question: "Why did the programmer quit his job?",
    answer: "Because he didn’t get arrays.",
  },
  {
    question: "Why did the chicken join a band?",
    answer: "Because it already had drumsticks.",
  },
  {
    question: "Why did the laptop go to therapy?",
    answer: "It had too many unresolved issues.",
  },
  {
    question: "Why did the scarecrow become a motivational speaker?",
    answer: "He was outstanding in his field.",
  },
  {
    question: "Why did the skeleton stay home from the party?",
    answer: "He had no body to go with.",
  },
  {
    question: "Why did the smartphone get glasses?",
    answer: "It lost all its contacts.",
  },
  {
    question: "Why did the JavaScript developer keep running?",
    answer: "Because they couldn’t stop throwing errors.",
  },
  {
    question: "Why did the bicycle fall over?",
    answer: "It was two tired.",
  },
  {
    question: "Why did the cookie go to the hospital?",
    answer: "It felt crumby.",
  },
  {
    question: "Why did the bug go to the software engineer’s house?",
    answer: "To crash on the couch.",
  },
];

function PageNotFound() {
  const [jokeIndex, setJokeIndex] = useState(null);
  const nextJoke = () => {
    if (jokeIndex === null) {
      setJokeIndex(0);
      return;
    }

    const next = (jokeIndex + 1) % jokes.length;
    setJokeIndex(next);
  };

  return (
    <>
      <div className="container d-flex m-auto min-vh-100 py-5 justify-content-center align-items-center gap-5">
        <h1 style={{ fontSize: "5rem", color: "var(--bs-danger)" }}>404!</h1>
        <div>
          <h4>Ooops!</h4>
          <small>
            The page you are looking for does not exist. It might have been
            moved or deleted.
          </small>
          <br />

          {typeof jokeIndex === "number" && (
            <div className="text-light bg-black p-2 px-3 rounded-3 mt-4">
              <div>{jokes[jokeIndex].question}</div>
              <em className="mx-1">Answer:</em> {jokes[jokeIndex].answer}
            </div>
          )}

          <br />

          <div className="text py-2">
            <Link
              className="p-2 shadow px-4 small rounded-pill"
              to={"/"}
              style={{ backgroundColor: "var(--background-light)" }}
            >
              <i className="bi bi-house"></i> &nbsp; Take me home
            </Link>
            <Link
              className="p-2 shadow px-4 small rounded-pill mx-2 bg-success text-light"
              onClick={nextJoke}
              style={{ backgroundColor: "var(--background-light)" }}
            >
              <i className="bi bi-house"></i> &nbsp; Tell me{" "}
              {typeof jokeIndex === "number" && jokeIndex >= 0
                ? "another joke"
                : "a joke"}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default PageNotFound;
