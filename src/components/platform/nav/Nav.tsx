import React, {ChangeEvent, Component} from "react";
import {Badge, Card, Container, Dropdown, FormControl, Nav as BootstrapNav, Navbar, NavDropdown} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {
    faBalanceScale,
    faCog,
    faExchangeAlt,
    faHome,
    faShieldAlt,
    faSignInAlt,
    faSignOutAlt,
    faUser,
    faUserPlus
} from "@fortawesome/free-solid-svg-icons/";
import {isDesktop} from "../../../general-components/Desktop";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";

import "./nav.scss";
import {getSaves} from "../../../general-components/API/calls/Saves";
import {SimpleSaveResource} from "../../../general-components/Datastructures";
import {Loader} from "../../../general-components/Loader/Loader";
import {RouteComponentProps, withRouter} from "react-router";
import FAE from "../../../general-components/Icons/FAE";
import {UserContext} from "../../../general-components/Contexts/UserContextComponent";
import AnonportModal from "./AnonportModal";


interface NavState {
    expanded: boolean
    showSearchOutput: boolean
    searchResult: SimpleSaveResource[]
    searchLoading: boolean
    anonPortModalShow: boolean
}

class Nav extends Component<RouteComponentProps, NavState> {
    static contextType = UserContext;
    context!: React.ContextType<typeof UserContext>
    private timeout: NodeJS.Timeout | undefined;

    constructor(props: any) {
        super(props);

        this.state = {
            expanded: false,
            showSearchOutput: false,
            searchResult: [],
            searchLoading: false,
            anonPortModalShow: false
        }
    }

    shouldComponentUpdate(nextProps: Readonly<RouteComponentProps>, nextState: Readonly<NavState>, nextContext: any): boolean {
        if (nextState.expanded !== this.state.expanded)
            return true;
        if (nextState.showSearchOutput !== this.state.showSearchOutput)
            return true;
        if (nextState.searchLoading !== this.state.searchLoading)
            return true;
        if (nextState.anonPortModalShow !== this.state.anonPortModalShow)
            return true;
        return nextState.searchResult !== this.state.searchResult;
    }

    setExpanded = (value: boolean) => {
        this.setState({
            expanded: value
        });
    }

    search = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let value = e.target.value;

        if (value === "") {
            this.setState({showSearchOutput: false});
        } else {
            this.setState({showSearchOutput: true});

            if (this.timeout) {
                clearTimeout(this.timeout);
            }

            this.timeout = setTimeout(async () => {
                this.setState({
                    searchLoading: true,
                    searchResult: []
                });

                let searchCall = await getSaves(this.context.user?.getID() as number, {
                    name: value,
                    description: value,
                    searchBoth: false
                });

                if (searchCall && searchCall.success) {
                    let searchCallData = searchCall.callData;

                    this.setState({
                        searchResult: searchCallData?.data
                    });
                }
                this.setState({
                    searchLoading: false
                });
            }, 400);
        }
    }

    removeDuplicateSaves = (saves: SimpleSaveResource[]): SimpleSaveResource[] => {
        let newSaves = [];
        let ids = new Map<number, null>();

        for (const save of saves) {
            if (!ids.has(save.id)) {
                newSaves.push(save);
            }

            ids.set(save.id, null);
        }

        return newSaves;
    }

    getToolLink(toolID: number, saveID: number) {
        if (toolID === 1) {
            return "/utility-analysis/" + saveID;
        } else if (toolID === 2) {
            return "/swot-analysis/" + saveID;
        } else if (toolID === 3) {
            return "/pairwise-comparison/" + saveID;
        } else if (toolID === 4) {
            return "/portfolio-analysis/" + saveID;
        }
        return "/";
    }

    getToolName(toolID: number) {
        if (toolID === 1) {
            return "Nutzwertanalyse";
        } else if (toolID === 2) {
            return "SWOT Analyse";
        } else if (toolID === 3) {
            return "Paarweiser Vergleich";
        } else if (toolID === 4) {
            return "Portfolio Analyse";
        }
    }

    render() {
        return (
            <>
                <Navbar onToggle={(e) => {
                    this.setExpanded(!this.state.expanded)
                }} expanded={this.state.expanded} expand="lg">
                    <Container>
                        <Navbar.Brand onClick={this.navOnClick} as={NavLink} to={"/"} exact className={"nav-link"}>

                            <FAE icon={faHome}/>&nbsp;
                            {process.env.REACT_APP_NAME}
                        </Navbar.Brand>

                        <Navbar.Toggle/>

                        <Navbar.Collapse>
                            <BootstrapNav className="m-auto">
                                {(this.context.isLoggedIn) && (
                                    <div className={"searchContainer"}>
                                        <FormControl
                                            type={"search"}
                                            title={"Nach Analysen suchen"}
                                            placeholder={"Nach Analysen suchen..."}
                                            onFocus={(e) => {
                                                if (e.target.value !== "") {
                                                    this.setState({showSearchOutput: true});
                                                }
                                            }}
                                            onBlur={() => {
                                                this.setState({showSearchOutput: false});
                                            }}
                                            onChange={(e) => {
                                                this.search(e);
                                            }}
                                        />

                                        <div
                                            className={"searchOutputContainer " + (this.state.showSearchOutput ? "show" : "")}>
                                            <div className={"header"}>
                                                <Badge pill bg={"dark"}>
                                                    <Loader payload={[]} variant={"light"}
                                                            loaded={!this.state.searchLoading}
                                                            transparent
                                                            size={10}>
                                                        {this.state.searchResult.length}
                                                    </Loader>
                                                </Badge>&nbsp;
                                                Ergebnisse
                                            </div>
                                            <div className={"output"}>
                                                <Loader payload={[]} variant={"style"}
                                                        loaded={!this.state.searchLoading}
                                                        transparent
                                                        size={100} alignment={"center"}>
                                                    {this.state.searchResult.map((value) => {
                                                        let link = this.getToolLink(value.tool_id, value.id);
                                                        return (
                                                            <Card as={NavLink}
                                                                  title={(value.description !== null) ? "Beschreibung: " + value.description : ""}
                                                                  to={link} onMouseDown={() => {
                                                                this.props.history.push(link); // TODO: Wenn man bereits auf einem Save ist, wird nicht der Push registriert, evtl. reload einbauen
                                                            }} key={"SAVE" + value.id} body className={"result"}>
                                                                {value.name} | {this.getToolName(value.tool_id)}
                                                            </Card>
                                                        )
                                                    })}
                                                    {this.state.searchResult.length === 0 && (
                                                        <Card body className={"result none"}>
                                                            Keine Ergebnisse
                                                        </Card>
                                                    )}
                                                </Loader>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </BootstrapNav>
                            <BootstrapNav>
                                {(!this.context.isLoggedIn) && (
                                    <>
                                        <NavLink onClick={this.navOnClick} to={"/login"} className={"nav-link"}>
                                            <FAE icon={faSignInAlt}/>&nbsp;
                                            Anmelden
                                        </NavLink>
                                        <NavLink onClick={this.navOnClick} to={"/register"} className={"nav-link"}>
                                            <FAE icon={faUserPlus}/>&nbsp;
                                            Registrieren
                                        </NavLink>
                                    </>
                                )}
                                {(this.context.isLoggedIn) && (
                                    <NavDropdown id={"profile-dropdown"} title={<><FAE
                                        icon={faUser}/> &nbsp;{!this.context.user?.isAnonymous() ? this.context.user?.getUsername() : ""}</>}>

                                        {!this.context.user?.isAnonymous() && (
                                            <Dropdown.Item as={NavLink} onClick={this.navOnClick} to={"/my-profile"}
                                                           role={"button"}>
                                                <FAE icon={faUser}/>&nbsp;
                                                Mein Profil
                                            </Dropdown.Item>
                                        )}

                                        {(this.context.user?.isAnonymous()) && (
                                            <Dropdown.Item as={"div"} onClick={() => {
                                                this.setState({
                                                    anonPortModalShow: true
                                                });
                                            }}
                                                           role={"button"}>
                                                <FAE icon={faExchangeAlt}/>&nbsp;
                                                Anonymes Konto Portieren
                                            </Dropdown.Item>
                                        )}

                                        <Dropdown.Item as={"div"} className="p-0">
                                            <NavLink onClick={this.navOnClick} to={"/logout"} role={"button"}
                                                     className={"dropdown-item"}>
                                                <FAE icon={faSignOutAlt}/>&nbsp;
                                                Abmelden
                                            </NavLink>
                                        </ Dropdown.Item>

                                    </NavDropdown>
                                )}
                            </BootstrapNav>
                            {(!isDesktop()) && (
                                <BootstrapNav>
                                    <NavDropdown id={"profile-dropdown"} title={"mehr"}>
                                        <Dropdown.Item as={NavLink} onClick={this.navOnClick} to={"/settings"}
                                                       role={"button"}>
                                            <FAE icon={faCog}/>&nbsp;
                                            Einstellungen
                                        </Dropdown.Item>
                                        <Dropdown.Item as={NavLink} onClick={this.navOnClick} to={"/data-privacy"}
                                                       role={"button"}>
                                            <FAE icon={faShieldAlt}/>&nbsp;
                                            Datenschutz
                                        </Dropdown.Item>
                                        <Dropdown.Item as={NavLink} onClick={this.navOnClick} to={"/legal-notice"}
                                                       role={"button"}>
                                            <FAE icon={faBalanceScale}/>&nbsp;
                                            Impressum
                                        </Dropdown.Item>
                                        <Dropdown.Item as={NavLink} onClick={this.navOnClick} to={"/about-us"}
                                                       role={"button"}>
                                            <FAE icon={faInfoCircle}/>&nbsp;
                                            Über uns
                                        </Dropdown.Item>
                                    </NavDropdown>
                                </BootstrapNav>
                            )}
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                <AnonportModal show={this.state.anonPortModalShow} onClose={() => {
                    this.setState({
                        anonPortModalShow: false
                    });
                }}/>
            </>
        );
    }

    private navOnClick = () => {
        this.setExpanded(false);
    };

}

export default withRouter(Nav);
