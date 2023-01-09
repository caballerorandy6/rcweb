import Layout from "../components/layout";
import PortfolioHeader from "../components/portfolioHeader";
import PortfolioGrid from "../components/portfolioGrid";

const Portfolio = () => {
  return (
    <Layout
      title={"Portfolio"}
      description={"Portfolio page, personal portfolio, rcweb"}
    >
      <PortfolioHeader />
      <PortfolioGrid />
    </Layout>
  );
};

export default Portfolio;
