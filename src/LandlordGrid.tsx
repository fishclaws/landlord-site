function LandlordGrid() {
    const landlords = [
        {
            name: "Landlord Name",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
    ];
    return (
        <div className="landlord-grid">
            {landlords.map((landlord, index) => 
            <div className="landlord-grid-item">
                <div className="landlord-grid-item-image">
                    <img src={landlord.image} alt="landlord" />
                </div>
                <div className="landlord-grid-item-text">
                    <h3>{landlord.name}</h3>
                    <p>{landlord.description}</p>
                </div>
            </div>
            )}
        </div>
    );
}

export default LandlordGrid;