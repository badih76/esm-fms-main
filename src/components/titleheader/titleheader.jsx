import React from 'react';

const TitleHeader = (props) => {
    const titleStyle = {
        paddingTop: "2vh",
        paddingBottom: "2vh",
        textAlign: "center",
        fontSize: "4vh",
        color: props.color,
        fontWeight: "bold",
        height: "9vh",
        backgroundColor: props.bgColor,
        textShadow: "2px 2px lightgray"
    }

    const { title } = props;

    return (
        <div className="row">
            <div className="col-md-12" style={titleStyle}>
                {title}
            </div>
        </div>
    );
}

export default TitleHeader;

export const TitlePageHeader = (props) => {
    const titleStyle = {
        paddingBottom: "2vh",
        textAlign: "center",
        fontSize: "3vh",
        color: props.color,
        fontWeight: "bold",
        height: "8vh",
        backgroundColor: props.bgColor,
        textShadow: "2px 2px lightgray"
    }

    const { title } = props;

    return (
        <div className="row">
            <div className="col-md-12" style={titleStyle}>
                {title}
            </div>
        </div>
    );
}
