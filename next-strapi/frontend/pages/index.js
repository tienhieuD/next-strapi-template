import React from "react"
import Seo from "../components/seo"
import { fetchAPI } from "../lib/api"

const Home = ({ homepage }) => {
  return (
    <>
      <Seo seo={homepage.seo} />
      <div className="uk-section">
        Hello, world!
      </div>
    </>
  )
}

export async function getStaticProps() {
  // Run API calls in parallel
  const [homepage] = await Promise.all([
    fetchAPI("/homepage"),
  ])

  return {
    props: { homepage },
    revalidate: 1,
  }
}

export default Home
