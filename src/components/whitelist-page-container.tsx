import { useState } from "react";
import type { WhitelistItem } from "../script/types";
import Card from "./card";
import EditingArea from "./editingArea";

const buttonStyle: React.CSSProperties = {
    padding: "0.5rem 1rem",
    fontSize: "1.2rem",
    backgroundColor: "#eee",
    color: "#1e1e1e",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    fontFamily: '"Major Mono Display", monospace',
    fontWeight: 400,
    fontStyle: "normal",
};

function Button({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
    const [hover, setHover] = useState(false);
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                ...buttonStyle,
                backgroundColor: hover ? "#222" : "#eee",
                color: hover ? "#ddd" : "#1e1e1e",
            }}
        >
            {children}
        </button>
    );
}

function WhitelistItemDiv({
    item,
    onEdit,
    onDelete,
}: {
    item: WhitelistItem;
    onEdit: (item: WhitelistItem) => void;
    onDelete: (id: bigint) => void;
}) {
    const containerStyle: React.CSSProperties = {
        display: "flex",
        gap: "1rem",
        width: "100%",
        borderBottom: "1px solid #333",
        paddingBottom: "1rem",
        alignItems: "center"
    };

    const textContainerStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        gap: 0,
        justifyContent: "flex-start",
        width: "100%",
    };

    const textItemStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
        gap: "0.5rem",
        width: "100%",
    };

    return (
        <div style={containerStyle}>
            <div style={textContainerStyle}>
                <div style={textItemStyle}>
                    <p style={{ whiteSpace: "nowrap", margin: 0, width: "200px" }}>Server / User Name:</p>
                    <EditingArea
                        value={item.server_name}
                        setValue={(value) => onEdit({ ...item, server_name: value })}
                    />
                </div>
                <div style={textItemStyle}>
                    <p style={{ whiteSpace: "nowrap", margin: 0, width: "200px" }}>Server / User ID:</p>
                    <EditingArea
                        value={item.discord_id == null || item.discord_id === "-1" ? "" : item.discord_id}
                        setValue={(value) => {
                            if (!/^\d*$/.test(value)) {
                                alert("Invalid Discord ID format. Must be a valid number.");
                                return;
                            }

                            const newId = value === "" ? "-1" : value;
                            onEdit({ ...item, discord_id: newId });
                        }}
                    />
                </div>
            </div>
            <Button onClick={() => onDelete(item.id)}>X</Button>
        </div>
    );
}

export default function WhitelistPageContainer({
    initialItems,
    configID,
}: {
    initialItems: WhitelistItem[];
    configID: bigint;
}) {
    const [items, setItems] = useState<WhitelistItem[]>(initialItems);

    const [newName, setNewName] = useState("");
    const [newId, setNewId] = useState("");

    const handleAdd = async () => {
        if (newName.trim() === "" && newId.trim() === "") {
            return alert("You must provide either a Name or an ID.");
        }

        let discordId = "-1";
        if (newId.trim() !== "") {
            if (!/^\d+$/.test(newId.trim())) {
                return alert("Invalid Discord ID format. Please enter a valid number.");
            }

            discordId = newId.trim();
        }

        const payload = {
            config_id: configID.toString(),
            server_name: newName,
            discord_id: discordId,
        };

        try {
            const res = await fetch("/api/whitelist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error(await res.text());
            }

            // Since our POST doesn't return the ID, we could just reload to get the real item with ID from DB.
            window.location.reload();
        } catch (err) {
            console.error("Error adding whitelist item:", err);
            alert("Failed to add whitelist item. Please check the console for details.");
        }
    };

    const handleEdit = async (updatedItem: WhitelistItem) => {
        // Optimistically update UI
        setItems((prev) => prev.map((i) => (i.id === updatedItem.id ? updatedItem : i)));

        try {
            const payload = {
                id: updatedItem.id.toString(),
                config_id: updatedItem.config_id.toString(),
                server_name: updatedItem.server_name,
                discord_id: updatedItem.discord_id,
            };

            const res = await fetch("/api/whitelist", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error(await res.text());
            }
        } catch (err) {
            console.error("Error updating whitelist item:", err);
            alert("Failed to update whitelist item. Please check the console for details.");
            // Revert on error
            setItems((prev) => prev.map((i) => (i.id === updatedItem.id ? items.find(it => it.id === updatedItem.id)! : i)));
        }
    };

    const handleDelete = async (id: bigint) => {
        if (!confirm("Are you sure you want to delete this whitelist item?")) return;

        const previousItems = [...items];
        setItems((prev) => prev.filter((i) => i.id !== id));

        try {
            const res = await fetch(`/api/whitelist?id=${id.toString()}`, { method: "DELETE" });
            if (!res.ok) {
                throw new Error(await res.text());
            }
        } catch (err) {
            console.error("Error deleting whitelist item:", err);
            alert("Failed to delete whitelist item. Please check the console for details.");
             setItems(previousItems); // Revert
        }
    };

    const flexColStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        width: "100%"
    };

    const addFormContainerStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "100%",
        marginBottom: "1rem"
    };

    const addFormInputStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "row",
        gap: "1rem",
        alignItems: "center"
    };

    const inputStyle: React.CSSProperties = {
        padding: "0.5rem",
        borderRadius: "8px",
        border: "1px solid #333",
        background: "#121212",
        color: "#fff",
        flex: "1"
    };

    return (
        <div style={flexColStyle}>
            <Card title="Add New Whitelist Item">
                <div style={addFormContainerStyle}>
                    <div style={addFormInputStyle}>
                        <label style={{ width: "200px" }}>Server / User Name:</label>
                        <input
                            type="text"
                            placeholder="e.g. My Cool Server"
                            style={inputStyle}
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                    </div>
                    <div style={addFormInputStyle}>
                        <label style={{ width: "200px" }}>Server / User ID:</label>
                        <input
                            type="text"
                            placeholder="e.g. 123456789012345678"
                            style={inputStyle}
                            value={newId}
                            onChange={(e) => setNewId(e.target.value)}
                        />
                    </div>
                </div>
                <Button onClick={handleAdd}>Add Item</Button>
            </Card>
            <Card title="Whitelist Items">
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
                    {items.map((item) => (
                        <WhitelistItemDiv
                            key={item.id.toString()}
                            item={item}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                    {items.length === 0 && <p>No whitelist items found for this config.</p>}
                </div>
            </Card>
        </div>
    );
}