import {
    Step,
    StepProp
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {PersonaAnalysisValues} from "../../PersonaAnalysis";


export interface PersonaShowValues {

}
export class PersonaShowComponent extends Step<PersonaAnalysisValues, PersonaShowValues>{


    public constructor(props: StepProp<PersonaAnalysisValues>, context: any) {
        super(props, context);
  
    }

    build(): JSX.Element {
        let citys =  this.props.save.data['persona-factors']?.factors.bedürfnisse.map((b)=>{ 
            return <span >{b.name}{b.desc}</span>  
        })     

        return <div>
                全属性：{ JSON.stringify(this.props.save)}
                <br/>
                wo:{citys}<br/>
                {/* 某一属性： 第一个页面的name:【 {this.props.save.data['persona-factors']?.factors.bedürfnisse[0].name}】 */}
                
            </div>
    }
}