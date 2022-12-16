import Layout from "../components/layout";
import AboutHeader from "../components/aboutHeader";
import AboutPersonalInfo from "../components/aboutPersonalInfo";
import AboutSkills from "../components/aboutSkills";

const About = () => {
  return (
    <Layout
      title={"About Me"}
      description={"About page, personal portfolio, rcweb"}
    >
      <AboutHeader />
      <AboutPersonalInfo />
      <AboutSkills />
    </Layout>
  );
};

export default About;
