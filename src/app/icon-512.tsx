import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
    width: 512,
    height: 512,
};
export const contentType = "image/png";

export default function Icon512() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 320,
                    background: "white",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "black",
                    fontWeight: "bold",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    border: "4px solid #e5e7eb",
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
