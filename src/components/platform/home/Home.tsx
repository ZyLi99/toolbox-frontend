import {Component} from "react";
import {Link} from "react-router-dom";
import {Col, Row} from "react-bootstrap";
import {faArrowsAlt, faBorderAll, faChartPie, faSortAmountDownAlt, faThLarge} from "@fortawesome/free-solid-svg-icons";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

import "./home.scss";
import "./home-desk.scss"
import FAE from "../../../general-components/Icons/FAE";


interface HomeState {
    tools: {
        name: string,
        link: string,
        icon: IconProp,
        maintenance: boolean
    }[]
}

export const Tools = [
    {
        id: 2,
        name: "SWOT Analyse",
        icon: faThLarge,
        link: "/swot-analysis",
        maintenance: false
    },
    {
        id: 3,
        name: "Paarweiser Vergleich",
        icon: faSortAmountDownAlt,
        link: "/pairwise-comparison",
        maintenance: false
    },
    {
        id: 1,
        name: "Nutzwertanalyse",
        icon: faBorderAll,
        link: "/utility-analysis",
        maintenance: false
    },
    {
        id: 4,
        name: "Portfolio Analyse",
        icon: faArrowsAlt,
        link: "/portfolio-analysis",
        maintenance: false
    },
    {
        id: 5,
        name: "ABC Analyse",
        icon: faChartPie,
        link: "/abc-analysis",
        maintenance: true
    }
];

export class Home extends Component<any, HomeState> {

    render() {
        return (
            <div className={"container"}>
                <Row className={"tools"}>
                    {(Tools.map(value => {
                        let classes = ["tool"];
                        let title = value.name;

                        if (value.maintenance) {
                            classes.push("maintenance");
                            title = "Diese Analyse befindet sich im Wartungsmodus. Bitte Schauen Sie zu einem späteren Zeitpunkt erneut vorbei.";
                        }

                        return (
                            <Col title={title} key={value.name} as={(value.maintenance) ? Col : Link}
                                 className={classes.join(" ")} to={value.link}>
                                <div className={"icon"}>
                                    <div>
                                        <FAE icon={value.icon}/>
                                    </div>
                                </div>
                                <div className={"text"}>
                                    {value.name}
                                </div>
                            </Col>
                        );
                    }))}
                </Row>
            </div>
        );
    }

}
