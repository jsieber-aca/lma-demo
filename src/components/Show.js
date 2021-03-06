import React from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import { FaPlay } from "react-icons/fa";
import { FaStop } from "react-icons/fa";

class Show extends React.Component {
  constructor(props) {
    super(props);
    this.playerRef = React.createRef();

    //console.log(this.props.match.params.identifier);
    this.state = {
      playing: false,
      loading: true,
      error: null,
      currentMusicIndex: 0,
    };
  }

  componentDidMount() {

    axios.get(`https://cors.archive.org/metadata/${this.props.match.params.identifier}`)
      .then(res => {
        //console.log(res.data);
        const audioFiles = res.data.files.filter(function(item){
          return item.name.slice(-3) === "mp3";
        });
        const flacAudioFiles = res.data.files.filter(function(item){
          return item.name.slice(-4) === "flac";
        });

        const playlist = audioFiles.map(item => {
            const container = {};
            container.src = "https://archive.org/download/" + res.data.metadata.identifier + "/" + item.name;
            container.name = item.title;
            return container;
        })


        this.setState({
          data: res.data,
          error: null,
          identifier: res.data.metadata.identifier,
          description: res.data.metadata.description,
          publicDate: res.data.metadata.publicdate,
          taper: res.data.metadata.taper,
          files: res.data.files,
          headerImage: `https://archive.org/download/${res.data.metadata.identifier}/${res.data.files[0].name}`,
          audioFiles: audioFiles,
          loading: false,
          playing: false,
          playlist: playlist,
          trackNum: 1,
          currentTrack: audioFiles[0].url,
        });

      })
      .catch(err => {
        // Something went wrong. Save the error in state and re-render.
        this.setState({
          loading: false,
          error: err
        });
      });

  }

  handleClickNext = () => {
    this.setState((prevState) => ({
      currentMusicIndex: prevState.currentMusicIndex < this.state.playlist.length - 1 ? prevState.currentMusicIndex + 1 : 0,
    }))
  }

  handleClickPrevious = () => {
     this.setState((prevState) => ({
       currentMusicIndex: prevState.currentMusicIndex === 0 ? this.state.playlist.length - 1 : prevState.currentMusicIndex - 1,
     }))
   };

  handlePlayClick = (): void => {
     this.setState((prevState) => ({
       currentMusicIndex: prevState.currentMusicIndex < this.state.playlist.length - 1 ? prevState.currentMusicIndex + 1 : 0,
     }))
   };

   handlePlay = (): void => {this.setState((prevState) => ({playing:true}))};

   handlePause = (): void => {this.setState((prevState) => ({playing:false}))};

   handleClickPlayList = (c,i): void => {
     console.log(this.playerRef);

   };


  renderLoading() {
    return <div>Loading...</div>;
  }

  renderError() {
    return (
      <div>
        Uh oh: {this.state.error.message}
      </div>
    );
  }

  renderShows() {

    if(this.state.error) {
      return this.renderError();
    }

    //console.log(this.state.audioFiles);
    console.log(this.state.data);
    const currentMusicIndex = this.state.currentMusicIndex;
    const playlist = this.state.playlist;

    return (

      <Container>
        <Row>
          <Col style={{ textAlign: "center" }}>
            <img src={this.state.headerImage} alt={this.state.title} width="250" />
          </Col>
        </Row>
        <Row>
          <Col style={{ textAlign: "center" }}>
            <p>{this.state.data.metadata.date}</p>
            <p>{this.state.data.metadata.title}</p>
            <p>Taper: {this.state.taper}</p>
            <p>Notes: {this.state.data.metadata.notes}</p>
          </Col>
        </Row>
        <Row>
          <Col style={{ textAlign: "center" }}>
            <div className="audioPlayer">
              <AudioPlayer
                ref={this.playerRef}
                autoPlay={true}
                autoPlayAfterSrcChange={true}
                showSkipControls={true}
                showJumpControls={true}
                src={playlist[currentMusicIndex].src}
                onClickPrevious={this.handleClickPrevious}
                onClickNext={this.handleClickNext}
                onPlay={this.handlePlay}
                onPause={this.handlePause}
                onEnded={this.handleClickNext}
                /*
                onPause={() => {
                  //PlaynPause(false);
                  //console.log(PlayerRef);
                  SetPlayerRef(PlayerRef);
                }}*/
                //onPlay={e => console.log(this.state.currentMusicIndex)}
                // other props here
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col style={{ textAlign: "center" }}>
            <div className="list-group" id="playlist">
              <ListGroup variant="flush">
                  {this.state.audioFiles.map((track, index) =>

                    <ListGroup.Item action variant="light" key={track.md5} className="showList">
                      <div className="list-group-item" onClick={() => { this.setState({ playing: false, currentMusicIndex:index})
                    }}


                       style={{ textAlign: "left" }}>
                        {this.state.currentMusicIndex === index && this.state.playing ? <FaPlay /> : "" }

                          <div>
                            {index + 1} - {track.title}
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <span className="badge">{track.length}</span >
                          </div>
                      </div>
                    </ListGroup.Item>
                  )}
              </ListGroup>
            </div>
          </Col>
        </Row>
        <Row>
          <Col style={{ textAlign: "center" }}>
            <Link to='/'>Back</Link>
          </Col>
        </Row>
        <Row>
          <Col style={{ textAlign: "center" }}>
            <img src="https://archive.org/download/etree/lma.jpg" alt="Archive.org Live Music Archive" width="100"/>
          </Col>
        </Row>
    </Container>
    );
  }

  render() {
    return (

      <div>
        <h1>{this.props.collection}</h1>
        {this.state.loading ?
          this.renderLoading()
          : this.renderShows()}
      </div>
    );
  }

}

export default Show;
