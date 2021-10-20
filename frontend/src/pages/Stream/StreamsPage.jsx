import {Container} from "react-bootstrap";
import VideoPlayer from "../../components/VideoPlayer";

const StreamsPage = () => {
    const pageTitle = "Streams";


    return (<>
            <Container className="d-flex justify-content-between">
                <h1>{pageTitle} Page</h1>
            </Container>
            <VideoPlayer/>
        </>
    )

};

export default StreamsPage;
