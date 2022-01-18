import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CardBody from "./post_card/CardBody";
import CardFooter from "./post_card/CardFooter";
import CardHeader from "./post_card/CardHeader";
import Comments from "./post_card/Comments";
import InputComment from "./post_card/InputComment";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { getDataAPI } from "../utils/fetchData";
import LoadMoreBtn from "./LoadMoreBtn";
import Loading from "./Loading";
import { POST_TYPES } from "../redux/actions/postActions";

function Posts() {
  const { homePosts, auth, theme } = useSelector((state) => state);
  const [load, setLoad] = useState(false);
  const [yes, setYes] = useState(false);
  const dispatch = useDispatch();

  const handleLoadMore = async () => {
    setLoad(true);
    const res = await getDataAPI(
      `posts?limit=${homePosts.page * 9}`,
      auth.token
    );

    dispatch({
      type: POST_TYPES.GET_POSTS,
      payload: {
        ...res.data,
        page: homePosts.page + 1,
      },
    });

    setLoad(false);
    setYes(true);
  };

  return (
    <div className="posts">
      {homePosts.posts?.map((post) => (
        <div key={post._id} className={`card my-3 ${yes && "end_gap"}`}>
          <CardHeader post={post} theme={theme} />
          <CardBody post={post} theme={theme} />
          <CardFooter post={post} theme={theme} />
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <h6 className="heading">View Comments</h6>
            </AccordionSummary>
            <AccordionDetails>
              <Comments post={post} />
            </AccordionDetails>
          </Accordion>
          <InputComment post={post} theme={theme} />
        </div>
      ))}
      {load && <Loading />}
      <LoadMoreBtn
        result={homePosts.result}
        page={homePosts.page}
        load={load}
        handleLoadMore={handleLoadMore}
      />
    </div>
  );
}

export default Posts;
