import React from "react";
import CardBody from "./post_card/CardBody";
import CardFooter from "./post_card/CardFooter";
import CardHeader from "./post_card/CardHeader";
import Comments from "./post_card/Comments";
import InputComment from "./post_card/InputComment";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

function SinglePost({ post }) {
  return (
    <div className="single_post">
      <div className="card my-3">
        <CardHeader post={post} />
        <CardBody post={post} />
        <CardFooter post={post} />
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
        <InputComment post={post} />
      </div>
    </div>
  );
}

export default SinglePost;
