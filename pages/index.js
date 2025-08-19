import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Wrapper from "./layout/wrapper";
import Home6 from "./home/home_6";

const MainRoot = () => {
  return (
    <Wrapper>
      <Home6 />
    </Wrapper>
  );
};

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default MainRoot;
