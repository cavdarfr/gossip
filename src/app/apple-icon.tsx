import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
    width: 180,
    height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 120,
                    background: "white",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "black",
                    fontWeight: "bold",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    borderRadius: 40,
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
