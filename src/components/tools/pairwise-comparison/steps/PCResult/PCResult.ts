import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {PairwiseComparisonValues} from "../../PairwiseComparison";
import {Draft} from "immer";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {PCResultComponent} from "./PCResultComponent";
import {Evaluation} from "../../../../../general-components/EvaluationComponent/Evaluation";


class PCResult implements StepDefinition<PairwiseComparisonValues>, StepDataHandler<PairwiseComparisonValues> {
    dataHandler: StepDataHandler<PairwiseComparisonValues>;
    form: React.FunctionComponent<StepProp<PairwiseComparisonValues>> | React.ComponentClass<StepProp<PairwiseComparisonValues>>;
    id: string;
    title: string;

    constructor() {
        this.title = "3. Ergebnis";
        this.id = "pc-result";
        this.form = PCResultComponent;
        this.dataHandler = this;
    }

    deleteData(data: Draft<PairwiseComparisonValues>): void {
        data["pc-result"] = undefined;
    }

    /**
     * Erstellen der Rangliste der Kriterien basierend auf einem Punktesystem
     */
    fillFromPreviousValues(data: Draft<PairwiseComparisonValues>): void {
        let criterias = data["pc-criterias"]?.criterias;
        let comparisons = data["pc-comparison"];

        if (criterias && comparisons) {
            let evaluation: Evaluation = Evaluation.from(criterias, comparisons);

            // finish up data
            data["pc-result"] = evaluation.getValues();
        }
    }

    isUnlocked(data: PairwiseComparisonValues): boolean {
        return data["pc-result"] !== undefined && Object.keys(data["pc-result"]).length > 0;
    }

    validateData(data: PairwiseComparisonValues): UIError[] {
        return [];
    }

}

export {
    PCResult
}
