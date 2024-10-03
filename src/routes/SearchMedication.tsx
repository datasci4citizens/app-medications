export default function SearchMedication() {
    return (
        <div>
            {[...Array(50)].map((_, i) => (
                <div key={i} className="p-4 border-b">
                    Item {i + 1}
                </div>
            ))}
        </div>
    )
}