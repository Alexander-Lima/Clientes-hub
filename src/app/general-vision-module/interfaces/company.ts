export interface Company {
    id: number | null;
    codigo: string | null;
    razaoSocial: string | null;
    endereco: string | null;
    atividadePrincipal: string | null;
    regimeApuracao: string | null;
    situacao: string | null;
    dataSource: string | null;
    lastUpdateClientes: string | null;
    inscricaoMunicipal: string | null;
    ccp: number | null;
    responsavelPrefeitura: string | null;
    lastUpdatePrefeitura: string | null;
    inscricaoEstadual: string | null;
    responsavelSefaz: string | null;
    lastUpdateSefaz: string | null;
    errorMessage: string | null;
    show: boolean;
}
