import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
    width: 192,
    height: 192,
};
export const contentType = "image/png";

export default function Icon192() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 128,
                    background: "white",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "black",
                    fontWeight: "bold",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    border: "2px solid #e5e7eb",
                }}
            >
                G
            </div>
        ),
        {
            ...size,
        }
    );
}
