import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-[1200px] px-8 pb-12 pt-16">
      <p className="mono mb-4 text-sm">Q?.</p>
      <h1 className="display" style={{ fontSize: "clamp(4rem, 11vw, 10rem)" }}>
        wrong
        <br />
        answer.
      </h1>
      <div
        className="display my-8 inline-block rounded-tr-[200px] bg-tomato px-14 pb-6 pt-4"
        style={{ fontSize: "clamp(5rem, 14vw, 12.5rem)" }}
      >
        404
      </div>
      <p className="mb-6 max-w-[420px] text-xl">
        That page doesn’t exist, or it moved. Pick another answer.
      </p>
      <Link href="/" className="display inline-block rounded-full bg-sun px-9 py-5 text-3xl">
        A · back to start
      </Link>
    </section>
  );
}