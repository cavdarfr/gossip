import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Gossip - Share Stories, Connect Communities";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: "white",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "black",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 40,
                    }}
                >
                    <div
                        style={{
                            width: 120,
                            height: 120,
                            background: "black",
                            color: "white",
                            borderRadius: 24,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 30,
                            fontSize: 64,
                            fontWeight: "bold",
                        }}
                    >
                        G
                    </div>
                    <div
                        style={{
                            fontSize: 72,
                            fontWeight: "bold",
                            color: "black",
                        }}
                    >
                        Gossip
                    </div>
                </div>
                <div
                    style={{
                        fontSize: 32,
                        textAlign: "center",
                        maxWidth: 800,
                        lineHeight: 1.4,
                        opacity: 0.7,
                        color: "black",
                    }}
                >
                    Share Stories, Connect Communities
                </div>
                <div
                    style={{
                        fontSize: 20,
                        textAlign: "center",
                        maxWidth: 600,
                        marginTop: 20,
                        opacity: 0.6,
                        color: "black",
                    }}
                >
                    The modern storytelling platform where communities come
                    together
                </div>
                <div
                    style={{
                        position: "absolute",
                        bottom: 40,
                        right: 40,
                        fontSize: 18,
                        opacity: 0.5,
                        color: "black",
                    }}
                >
                    gossip.vercel.app
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
