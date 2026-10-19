import {
  SiReact,
  SiFastapi,
  SiPython,
  SiMongodb,
  SiThreedotjs,
} from "react-icons/si";

export default function Trusted() {
  const tech = [
    {
      icon: <SiReact size={42} />,
      name: "React",
    },
    {
      icon: <SiFastapi size={42} />,
      name: "FastAPI",
    },
    {
      icon: <SiPython size={42} />,
      name: "Python",
    },
    {
      icon: <SiMongodb size={42} />,
      name: "MongoDB",
    },
    {
      icon: <SiThreedotjs size={42} />,
      name: "Three.js",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto py-24 px-8">
      <h2 className="text-center text-slate-400 uppercase tracking-widest">
        Powered By Modern Technologies
      </h2>

      <div className="grid md:grid-cols-5 gap-8 mt-14">
        {tech.map((item) => (
          <div
            key={item.name}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-8 hover:border-blue-500 transition duration-300 text-center"
          >
            <div className="flex justify-center text-blue-500">{item.icon}</div>

            <h3 className="mt-5 font-semibold">{item.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
