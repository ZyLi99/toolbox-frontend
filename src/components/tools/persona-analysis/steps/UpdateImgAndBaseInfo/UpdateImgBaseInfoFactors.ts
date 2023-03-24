
import {
    StepDataHandler,
    StepDefinition,
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {PersonaAnalysisValues} from "../../PersonaAnalysis";
import {UpdateImgActionsValuesComponent} from "./UpdateImgBaseInfoComponent";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";


export class ImgFactors implements StepDefinition<PersonaAnalysisValues>, StepDataHandler<PersonaAnalysisValues>  {

    form: React.FunctionComponent<StepProp<PersonaAnalysisValues>> | React.ComponentClass<StepProp<PersonaAnalysisValues>>;
    id: string;
    title: string;
    dataHandler: StepDataHandler<PersonaAnalysisValues>;


    constructor() {
        this.id = "Profibild hochladen";
        this.title = "1. Profibild hochladen";
        this.form = UpdateImgActionsValuesComponent;
        this.dataHandler = this;
       
    }
    private static requireData(data: PersonaAnalysisValues) {
        let d = data["uploadImage_actions"];

        if (d === undefined) {
            d = {
                factors: {
                    name: '',
                    vorname: '',
                    alter: '',
                    profibild: '',
                    profibildName: '',
                }
            }
        };
        
        return d;
    }

    
   // TODO 判断上一个页面是否完成， 本方法用于标记本页面是否被解锁
    isUnlocked = (data: PersonaAnalysisValues): boolean =>    true;
    


    // 初始化的值
    fillFromPreviousValues = (data: PersonaAnalysisValues) => {
        let analysisValues = data["uploadImage_actions"];
        if (analysisValues === undefined) {
            analysisValues = {
                "factors":{
                    name: "",
                    vorname: "",
                    alter: "",
                    profibild: "",
                    profibildName: ""
                }
            }
        }
        data["uploadImage_actions"] = analysisValues
   
       
    };



    deleteData(data: PersonaAnalysisValues): PersonaAnalysisValues {
        
        let d = ImgFactors.requireData(data);
        d.factors.name = ""
        d.factors.vorname = ""
        d.factors.alter = ""
        d.factors.profibild = ""
        d.factors.profibildName =""
        data["uploadImage_actions"] = d;
        return data;
    }

    validateData(data: PersonaAnalysisValues): UIError[] {
        const errors = Array<UIError>();
        const errorText = (text: string) => `Bitte füllen Sie alle ${text} aus!`;
        // const errorText = (text: string) => `Bitte füllen Sie alle ${text} aus!`;
        if ((data["uploadImage_actions"]?.factors.name==''||data["uploadImage_actions"]?.factors.name==undefined)) {
            errors.push({
                id: "persona-analysis.name",
                message: errorText("name"),
                level: "error"
            });
        }
        return errors;
    }


}
