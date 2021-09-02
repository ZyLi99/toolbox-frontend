import "./pairwise-comparison.scss";
import StepComponent from "../../../general-components/StepComponent/StepComponent";
import {PCCriterias} from "./steps/PCCriterias";
import {Component} from "react";
import {faSortAmountDownAlt} from "@fortawesome/free-solid-svg-icons";
import {PCPairComparison} from "./steps/PCPairComparison";
import {FormComponent} from "../../../general-components/Form/FormComponent";

export class PairwiseComparison extends Component<any, any> {

    render() {
        return (
            <div className={"container"}>
                <StepComponent
                    header={"Paarweiser Vergleich"}
                    onSave={this.save}
                    steps={[
                        {
                            form: <PCCriterias/>,
                            title: "1. Kritierien festlegen",
                            id: "pc-criterias"
                        },
                        {
                            form: <PCPairComparison/>,
                            title: "2. Paarvergleich",
                            id: "pc-comparison"
                        }
                    ]}
                    controlFooterTool={{
                        tool: {
                            title: "PV-Start",
                            link: "/pairwise-comparison",
                            icon: faSortAmountDownAlt
                        }
                    }}
                />
            </div>
        );
    }

    save = async (data: any, forms: Map<string, FormComponent<any, any>>) => {
        return true;
    }

}
