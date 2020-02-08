export default class NCovStats {
    public Confirmed = 0;
    public Deaths = 0;
    public Recovered = 0;

    public constructor(
        confirmed: number,
        deaths: number,
        recovered: number
    ) {
        this.Confirmed = confirmed;
        this.Deaths = deaths;
        this.Recovered = recovered;
    }
};
